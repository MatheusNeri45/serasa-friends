// import { PrismaClient } from "@prisma/client";
// import { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   const req = await request.json();
//   try {
//     const group = await prisma.group.create({
//       data: {
//         name: req.name,
//         description: req.description || null,
//         owner: {
//           connect: { id: req.userId },
//         },
//         members: {
//           connect: [
//             { id: req.userId },
//             ...(req.membersIds || []).map((memberId: number) => ({
//               id: memberId,
//             })),
//           ],
//         },
//       },
//     });
//     return NextResponse.json(
//       { message: "Group created", groupCreated: group },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Unable to create group" },
//       { status: 500 }
//     );
//   }
// }
