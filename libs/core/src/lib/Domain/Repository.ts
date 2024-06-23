export interface ReadRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  exists(id: ID): Promise<boolean>;
}

export interface WriteRepository<T, ID> {
  save(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
  deleteById(id: ID): Promise<void>;
}

export interface Repository<T, ID> extends ReadRepository<T, ID>, WriteRepository<T, ID> {}
