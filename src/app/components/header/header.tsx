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
      <CompanyWebsiteButton />
      <HStack spacing={"25px"} marginRight={"150px"}>
        <TabButton
          title={"Mint/Unmint dlcBTC"}
          isActive={activeTab === "/"}
          handleClick={() => handleTabClick("/")}
        />
        <TabButton
          title={"My dlcBTC"}
          isActive={activeTab === "/my-dlc-btc"}
          handleClick={() => handleTabClick("/my-dlc-btc")}
        />
        <TabButton
          title={"How It Works"}
          isActive={activeTab === "/how-it-works"}
          handleClick={() => handleTabClick("/how-it-works")}
        />
      </HStack>
      <Account />
    </HeaderLayout>
  );
}
