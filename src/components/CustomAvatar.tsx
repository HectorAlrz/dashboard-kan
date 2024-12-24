import React from "react";
import { getNameInitials } from "@/utilities";
import { Avatar as AntAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
  name?: string;
};

function CustomAvatar({ name, style, ...rest }: Props) {
  return (
    <AntAvatar
      alt={"Michael Scott"}
      size="small"
      style={{
        backgroundColor: "#87d068",
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style
      }}
      {...rest}
    >
      {getNameInitials(name || "")}
    </AntAvatar>
  );
}

export default CustomAvatar;
