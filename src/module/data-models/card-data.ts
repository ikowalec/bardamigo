/**
 * Data Model for Card Items in BarDaMIgo (Foundry VTT v14).
 */
export class CardData extends foundry.abstract.TypeDataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      cardType: new fields.StringField({
        required: true,
        initial: 'gear',
        choices: ['weapon', 'protection', 'spell', 'gear', 'ability', 'relic']
      }),
      slot: new fields.StringField({
        required: true,
        initial: 'any',
        choices: ['weapon', 'protection', 'any', 'development', 'backpack']
      }),
      attribute: new fields.StringField({
        required: true,
        initial: 'none',
        choices: ['none', 'sila', 'zrecznosc', 'umysl', 'wola']
      }),
      bonusDefense: new fields.NumberField({ required: true, integer: true, initial: 0 }),
      bonusInitiative: new fields.NumberField({ required: true, integer: true, initial: 0 }),
      defenseDie: new fields.StringField({
        required: true,
        initial: 'none',
        choices: ['none', 'd4', 'd6', 'd8', 'd10', 'd12']
      }),
      defenseTrigger: new fields.StringField({ initial: '' }),
      damageHits: new fields.NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      cost: new fields.NumberField({ required: true, integer: true, min: 0, initial: 2 }),
      description: new fields.HTMLField({ initial: '' })
    };
  }
}
