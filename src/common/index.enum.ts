export enum SwaggerApiEnumTags {
  APP = 'app',
  USER = 'User',
  CATEGORY = 'Category',
  COMMODITY = 'Commodity',
  COMMODITYUNIT = 'Commodity Unit',
  PURCHASEPERIOD = 'Market Run ',
  PURCHASEPERIODITEM = 'Market Run Commodities',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  PATRON = 'PATRON',
  PROCUREE = 'PROCUREE',
}

export enum UnitType {
  SCIENTIFIC = 'SCIENTIFIC', // kilogram, litre, gram, millilitre
  COMMON_USE = 'COMMON_USE', // bag, derica, congo, crate, bunch, pack
}

export enum PurchasePeriodStatus {
  DRAFT = 'DRAFT', // Admin is still configuring prices
  OPEN = 'OPEN', // Procurees can place/modify requests
  CLOSED = 'CLOSED', // Requests locked; admin going to market
  FINALIZED = 'FINALIZED', // Allocations + fulfillment recorded
  PUBLISHED = 'PUBLISHED',
  SAVED = 'SAVED',
  RECONCILED = 'RECONCILED',
}

export enum PurchasePeriodItemStatus {
  ACTIVE = 'ACTIVE', // visible & orderable
  HIDDEN = 'HIDDEN', // not visible to Procurees (e.g., draft)
  DISABLED = 'DISABLED', // temporarily disabled for this period
}
