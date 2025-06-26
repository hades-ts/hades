export abstract class ILoginService {
    abstract login(): Promise<string>;
}
