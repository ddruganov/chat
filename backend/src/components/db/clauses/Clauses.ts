import From from "./From";
import Join from "./Join";
import Select from "./Select";
import Where from "./where/Where";

type Clauses = {
    select: Select[],
    from?: From,
    join: Join[],
    where: Where[]
};

export default Clauses;