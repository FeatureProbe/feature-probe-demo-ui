export interface IEnvironment {
  name: string;
  key: string;
  clientSdkKey: string;
  serverSdkKey: string;
}

export interface IProject {
  name: string;
  key: string;
  description: string;
  environments: IEnvironment[];
}