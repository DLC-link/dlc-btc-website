import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HStack } from "@chakra-ui/react";
import { Account } from "@components/account/account";
import { CompanyWebsiteButton } from "@components/company-website-button/company-website-button";
import { HeaderLayout } from "@components/header/components/header.layout";
import { TabButton } from "@components/tab-button/tab-button";

export function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/");

  const handleTabClick = (route: string) => {
    setActiveTab(route);
    navigate(route);
  };

  return (
    <HeaderLayout>
      <HStack width={"50%"} spacing={"7.5%"} alignItems={"flex-end"}>
        <CompanyWebsiteButton />
        <TabButton
          title={"Mint/Unmint dlcBTC"}
          isActive={activeTab === "/"}
          handleClick={() => handleTabClick("/")}
        />
        <TabButton
          title={"How It Works"}
          isActive={activeTab === "/about"}
          handleClick={() => handleTabClick("/about")}
        />
      </HStack>
      <Account />
    </HeaderLayout>
  );
}
