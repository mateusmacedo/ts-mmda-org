export interface IdentityGenerator<ID> {
  generate(): ID;
}

export type BaseEntityProps<ID> = {
  id: ID;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type EntityProps<T> = Partial<T>;

export abstract class BaseEntity<T extends BaseEntityProps<ID>, ID> {
  protected props: T;

  constructor(props: EntityProps<T>) {
    const {
      id,
      version = 1,
      createdAt = new Date(),
      updatedAt = new Date(),
      deletedAt = null,
      ...rest
    } = props;

    if (id == null) throw new Error('ID is required');
    if (typeof version !== 'number' || isNaN(version)) throw new Error('Version must be a number');
    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()))
      throw new Error('CreatedAt must be a Date');
    if (!(updatedAt instanceof Date) || isNaN(updatedAt.getTime()))
      throw new Error('UpdatedAt must be a Date');
    if (
      deletedAt !== null &&
      deletedAt !== undefined &&
      (!(deletedAt instanceof Date) || isNaN(deletedAt.getTime()))
    ) {
      throw new Error('DeletedAt must be a Date or null');
    }

    this.props = {
      id,
      version,
      createdAt,
      updatedAt,
      deletedAt,
      ...rest,
    } as T;
  }

  public getId(): ID {
    return this.props.id;
  }

  public getVersion(): number {
    return this.props.version;
  }

  public incrementVersion(): void {
    this.props.version++;
    this.props.updatedAt = new Date();
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  public getDeletedAt(): Date | null {
    return this.props.deletedAt;
  }

  public getProps(): T {
    return { ...this.props };
  }

  protected setDeletedAt(date: Date | null | undefined): void {
    if (date !== null && date !== undefined && (!(date instanceof Date) || isNaN(date.getTime()))) {
      throw new Error('DeletedAt must be a Date or null');
    }
    this.props.deletedAt = date === undefined ? null : date;
  }
}
