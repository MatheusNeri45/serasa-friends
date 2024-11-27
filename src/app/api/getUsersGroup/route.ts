import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Members{
  id: number,
  name: string,
}
interface GroupInfo{
  id: number,
  name: string,
  description:string,
  createdAt:string,
  updatedAt:string,
  creatorId:number,
  members: Members[],

}
export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const groupInfo = await prisma.group.findFirst({
      where: {
        id: req.groupId,
      },
      include: {
        members: {
          select:{
            id:true,
            name:true,
          }
        }
      },
    });
    if(groupInfo){
      return NextResponse.json({ groupInfo:groupInfo.members }, { status: 200 });
    } 
  } catch {
    return NextResponse.json({ groupInfo: [] }, { status: 200 });
  }
}
