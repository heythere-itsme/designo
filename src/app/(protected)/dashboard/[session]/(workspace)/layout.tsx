// THE REDIRECT HERE IS MAKING A MESS!!!



import Navbar from "@/components/Navbar"
import { SubscriptionEntitlementQuery } from "@/convex/query.config"
import { combinedSlug } from "@/lib/utils"
import { redirect } from "next/navigation"
import React from "react"

type Props = {
    children: React.ReactNode
}

const Layout = async ({children}: Props) => {
    const {profileName, entitlement} = await SubscriptionEntitlementQuery()
    if (!entitlement._valueJSON) {
        // redirect(`/billing/${combinedSlug(profileName!)}`)
    }
  return (
    <div>
        <Navbar />
    <div>{children}</div>
    </div>
  )
}

export default Layout;
