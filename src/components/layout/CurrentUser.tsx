import React, { useState } from "react";
import { Button, Popover } from "antd";
import { useGetIdentity } from "@refinedev/core";
import CustomAvatar from "../CustomAvatar";
import { Text } from "../Text";
import { AccountSettings } from "./AccountSettings";
import { SettingOutlined } from "@ant-design/icons";
import type { User } from "@/graphql/schema.types";

function CurrentUser() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useGetIdentity<User>();

  const renderContent = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text strong style={{ padding: "12px 20px" }}>
          {user?.name}
        </Text>
        <div
          style={{
            borderTop: "1px solid #d9d9d9",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Button
            style={{ textAlign: "left" }}
            icon={<SettingOutlined />}
            type="text"
            block
            onClick={() => setIsOpen(true)}
          >
            Account Settings
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
        content={renderContent}
      >
        <CustomAvatar
          name={user?.name}
          src={user?.avatarUrl}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>
      { user && (
         <AccountSettings opened={isOpen} setOpened={setIsOpen} userId={user.id} />
        )}
    </>
  );
}

export default CurrentUser;
