export class Mapper {
  static toDomain<TDomain, TEntity>(
    entity: TEntity,
    DomainClass: new () => TDomain,
  ): TDomain {
    const domainInstance: any = new DomainClass();

    for (const key of Object.keys(entity as any)) {
      domainInstance[key] = (entity as any)[key];
    }

    return domainInstance as TDomain;
  }

  static toDomainList<TDomain, TEntity>(
    entities: TEntity[],
    DomainClass: new () => TDomain,
  ): TDomain[] {
    return entities.map(e => this.toDomain(e, DomainClass));
  }
}
