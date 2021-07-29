type Errors = {
    [key: string]: string | number;
};

export default class ExecutionResult {
    private success: boolean;
    private data: any;
    private errors: Errors;

    public constructor(success: boolean, data: any = {}, errors: Errors = {}) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }

    public asJson() {
        return {
            success: this.success,
            data: this.data,
            error: this.errors[Object.keys(this.errors)[0]]
        };
    }
}