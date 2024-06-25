export interface IReadRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  exists(id: ID): Promise<boolean>;
}

export interface IWriteRepository<T, ID> {
  save(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
  deleteById(id: ID): Promise<void>;
}

export interface IRepository<T, ID> extends IReadRepository<T, ID>, IWriteRepository<T, ID> {}
