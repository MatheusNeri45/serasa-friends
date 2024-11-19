import { PrismaClient } from "@prisma/client";
import { error, group } from "console";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Members{
  id: Number,
  name: String,
}
interface GroupInfo{
  id: Number,
  name: String,
  description:String,
  createdAt:String,
  updatedAt:String,
  creatorId:Number,
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
      return NextResponse.json({ groupInfo:groupInfo }, { status: 200 });
    } 
  } catch {
    return NextResponse.json({ groupInfo: [] }, { status: 200 });
  }
}
