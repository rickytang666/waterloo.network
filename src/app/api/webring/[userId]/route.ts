import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                website: true,
                embedColor: true,
                embedArrow: true,
                embedCustomColor: true,
                connections: {
                    select: {
                        toUser: {
                            select: {
                                id: true,
                                name: true,
                                website: true,
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const webringData = {
            userId: user.id,
            userName: user.name,
            userWebsite: user.website,
            embedColor: user.embedColor || 'black',
            embedArrow: user.embedArrow || 'arrow',
            embedCustomColor: user.embedCustomColor,
            friends: user.connections.map((conn: any) => ({
                id: conn.toUser.id,
                name: conn.toUser.name,
                website: conn.toUser.website,
            })).filter((f: any) => f.website),
        };

        return NextResponse.json(webringData);
    } catch (error) {
        console.error('Webring API Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

