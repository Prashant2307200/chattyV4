import React, { memo, useMemo } from "react";
import { MessageSquare } from "lucide-react";

function Logo(props) {
  return useMemo(() => <MessageSquare {...props} />, [props]);
}
export default memo(Logo); 