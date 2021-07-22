export default class RequestOptions {
  private _stringify: boolean = true;
  private _ignoredByState: boolean = true;

  get stringify() {
    return this._stringify;
  }

  get ignoredByState() {
    return this._ignoredByState;
  }

  setStringify(value: boolean): this {
    this._stringify = value;
    return this;
  }

  setIgnoredByState(value: boolean): this {
    this._ignoredByState = value;
    return this;
  }
}
