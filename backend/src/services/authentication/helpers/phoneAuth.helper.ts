
export enum CodeType {
    NUMBER = 'NUMBER',
    STRING = 'STRING',
}
export class PhoneVerfication {
    public static get randomCode() {
        const high = 9999;
        const low = 1000;
        const code = (Math.floor(Math.random() * (high - low) + low)).toString();
        return {
            code,
            codeLength: code.toString().length,
            codeType: CodeType.NUMBER,
        };
    }

}
