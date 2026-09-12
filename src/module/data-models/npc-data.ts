/**
 * Data Model for NPC / Enemy Actors in BarDaMIgo (Foundry VTT v14).
 */
export class NpcData extends foundry.abstract.TypeDataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      defense: new fields.NumberField({ required: true, integer: true, initial: 10, min: 0 }),
      hitLimit: new fields.NumberField({ required: true, integer: true, initial: 3, min: 1 }),
      hits: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      attack: new fields.SchemaField({
        bonus: new fields.NumberField({ required: true, integer: true, initial: 2 }),
        description: new fields.StringField({ initial: '1d20 + 2 (1 hit)' })
      }),
      defenseDie: new fields.StringField({
        required: true,
        initial: 'none',
        choices: ['none', 'd4', 'd6', 'd8', 'd10', 'd12']
      }),
      will: new fields.NumberField({ required: true, integer: true, initial: 0 }),
      specialRules: new fields.HTMLField({ initial: '' })
    };
  }

  override prepareDerivedData() {
    // Check if enemy is downed/defeated
    this.isDowned = this.hits >= this.hitLimit;
  }
}
