import { WidgetConfig } from "@medusajs/admin";
import { useAdminGetSession } from "medusa-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "@medusajs/admin-ui/ui/src/components/templates/login-layout";




const WalletLoginWidget = () => {
    const {user} = useAdminGetSession();

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/a/walletLogin");
        }
    }, [user, navigate]);


    return (
        <div>
            <h1>Wallet Login</h1>
        </div>
    )
}

export const config: WidgetConfig = {
    zone: "login.before"
}

export default WalletLoginWidget;