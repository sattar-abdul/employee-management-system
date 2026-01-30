import { NextResponse } from "next/server";

export async function POST(){
    const response = NextResponse.json({message: "Logged out successfully"});

    // Clear the cookie by setting it's expiration to the past
    response.cookies.set('userRole', '', {expires: new Date(0)});

    return response;
}