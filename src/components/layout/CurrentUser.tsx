import React from "react";
import { Button, Popover } from "antd";

function CurrentUser() {
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
      >
        <Button>Button</Button>
      </Popover>
    </>
  );
}

export default CurrentUser;
