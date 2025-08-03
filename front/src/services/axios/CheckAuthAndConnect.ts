"use client";
import { useEffect } from "react";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import socketConnect from "@/services/axios/socketConnect";
import { clearAllLocalStorage } from "@/utils/storage";
import { redirect } from "next/navigation";



export function CheckAuthAndConnect(connType: string = "1") {

  useEffect(() => {
	const isAuthenticated = checkAuthTokens();
	if (!isAuthenticated) {
	clearAllLocalStorage();
	  redirect("/login");
	} else {
	  socketConnect(connType);
	}
  }, [connType]);
}
