export class CreditHasher {
    static async hashWalletCredit(amount: number) {
        return amount.toString();
    }
    static async dehashWalletCredit(amount: string) {
        return parseInt(amount, 10);
    }
}