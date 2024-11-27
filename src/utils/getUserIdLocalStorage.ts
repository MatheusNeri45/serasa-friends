"use client"
export function getUserId() {
    const userId = Number(localStorage.getItem("id"));
    return userId;
}
