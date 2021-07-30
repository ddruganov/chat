type Errors = {
    [key: string]: string | number;
};

export default class ExecutionResult {
    private success: boolean;
    private data: any;
    private errors: Errors;
    private code?: number;

    public constructor(success: boolean, data: any = {}, errors: Errors = {}, code: number | undefined = undefined) {
        this.success = success;
        this.data = data;
        this.errors = errors;
        this.code = code;
    }

    public asJson() {
        return {
            success: this.success,
            data: this.data,
            error: this.errors[Object.keys(this.errors)[0]],
            code: this.code
        };
    }
}