import BaseValidator from "../../components/validators/BaseValidator";

type ModelRule = {
    columns: string[];
    validator: typeof BaseValidator;
};

export default ModelRule;