import From from "./From";
import Where from "./where/Where";

type Join = {
    type: string;
    from: From;
    on: Where;
};
export default Join;