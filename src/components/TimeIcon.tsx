
import React from "react";
import { Clock } from "lucide-react";

// This is just a simple wrapper around the lucide-react Clock icon
// to maintain consistent naming with your custom component requirements
const TimeIcon: React.FC<React.ComponentProps<typeof Clock>> = (props) => {
  return <Clock {...props} />;
};

export default TimeIcon;
