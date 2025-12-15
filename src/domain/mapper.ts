export class Mapper {
  static toDomain<TDomain, TEntity>(
    entity: TEntity,
    DomainClass: new () => TDomain,
  ): TDomain {
    const domainInstance: any = new DomainClass();

    for (const key of Object.keys(domainInstance)) {
      if (Object.prototype.hasOwnProperty.call(entity, key)) {
        domainInstance[key] = (entity as any)[key];
      }
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
