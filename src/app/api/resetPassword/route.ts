import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

const resend = new Resend(process.env.RESEND_API_KEY);

function createEmailHtml(userName: string, resetLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Recuperação de Senha</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1B4332; font-size: 24px; font-weight: bold; margin-bottom: 8px;">
              Recuperação de Senha
            </h1>
            <p style="color: #2D6A4F; font-size: 16px; margin: 0;">
              Serasa Friends
            </p>
          </div>

          <div style="color: #333333; font-size: 16px; line-height: 24px;">
            <p>Olá ${userName},</p>

            <p>
              Recebemos uma solicitação para redefinir a senha da sua conta no Serasa Friends.
              Se você não fez essa solicitação, pode ignorar este e-mail com segurança.
            </p>

            <p>Para redefinir sua senha, clique no botão abaixo:</p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" 
                 style="background-color: #2D6A4F; 
                        color: #ffffff; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        text-decoration: none; 
                        font-weight: 500; 
                        display: inline-block;">
                Redefinir Senha
              </a>
            </div>

            <p style="color: #666666; font-size: 14px;">
              Por questões de segurança, este link expira em 1 hora.
            </p>

            <p style="color: #666666; font-size: 14px;">
              Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
            </p>

            <p style="word-break: break-all;">
              <a href="${resetLink}" 
                 style="color: #2D6A4F; 
                        font-size: 14px; 
                        text-decoration: none;">
                ${resetLink}
              </a>
            </p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;">

            <p style="color: #666666; font-size: 14px; text-align: center;">
              Se você não solicitou a redefinição de senha, por favor ignore este e-mail
              ou entre em contato com nosso suporte caso tenha alguma dúvida.
            </p>

            <div style="text-align: center; margin-top: 32px; color: #666666; font-size: 14px;">
              © ${new Date().getFullYear()} Serasa Friends. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const JWT_SECRET = process.env.JWT_SECRET_KEY;

    if (!email) {
      return NextResponse.json(
        { message: "Favor digitar o email." },
        { status: 400 }
      );
    }

    const userFound = await prisma.user.findFirst({
      where: { email }
    });

    if (!userFound) {
      return NextResponse.json(
        { message: "Nenhum usuário cadastrado com esse e-mail." },
        { status: 404 }
      );
    }

    if (!JWT_SECRET) {
      throw new Error("JWT Secret not configured");
    }

    const token = jwt.sign(
      { userId: userFound.id },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password-forms?token=${token}`;

    await resend.emails.send({
      from: `Serasa Friends <${process.env.RESEND_EMAIL_DOMAIN}>`,
      to: email,
      subject: "Recuperação de Senha - Serasa Friends",
      html: createEmailHtml(userFound.name, resetLink)
    });

    return NextResponse.json(
      { message: "Link para reset de senha enviada para o e-mail fornecido." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Não foi possível enviar um e-mail de recuperação, verifique o e-mail:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Não foi possível enviar um e-mail de recuperação." },
      { status: 500 }
    );
  }
}