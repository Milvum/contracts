interface IContract {
  address: string;
  deployed: () => Promise<any>;
}

interface IArtifacts {
  require: (contractPath: string) => IContract;
}

/* Globals */
declare var artifacts: IArtifacts;
