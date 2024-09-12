import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
function createUser(res: any) : object {

    const duck = prisma.user.create({
        data: {
                email: res.get('email'),
                name: res.get('name'),
                password: bcrypt.hashSync(res.get('password'),10)
            },
    });
    
    return duck
};
export async function POST(request: Request) {
    const res = await request.json()
    const email = res.get('email')
    const duckFound = await prisma.duck.findFirst({
            where: {
                email: email,
            },
        });
    if(duckFound){
        return Response.json({
            'message': 'There is already a duck with this email.'
        })
    }else{
        const duckCreated = createDuck(res)
        return Response.json({
            'message': 'Account succesfully created, you are not a sad lonely duck anymore!',
            'duckInfo': duckCreated,
        },
    )};
}