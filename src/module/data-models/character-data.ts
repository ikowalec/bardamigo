/**
 * Data Model for Character Actors in BarDaMIgo (Foundry VTT v14).
 */
export class CharacterData extends foundry.abstract.TypeDataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      // Basic Info
      player: new fields.StringField({ initial: '' }),
      concept: new fields.StringField({ initial: '' }),
      description: new fields.HTMLField({ initial: '' }),
      goal: new fields.StringField({ initial: '' }),
      notes: new fields.HTMLField({ initial: '' }),

      // 4 Core Attributes (start: +3, +2, +1, +0; max: +4)
      attributes: new fields.SchemaField({
        sila: new fields.SchemaField({
          value: new fields.NumberField({ required: true, integer: true, initial: 0, min: -2, max: 4 })
        }),
        zrecznosc: new fields.SchemaField({
          value: new fields.NumberField({ required: true, integer: true, initial: 0, min: -2, max: 4 })
        }),
        umysl: new fields.SchemaField({
          value: new fields.NumberField({ required: true, integer: true, initial: 0, min: -2, max: 4 })
        }),
        wola: new fields.SchemaField({
          value: new fields.NumberField({ required: true, integer: true, initial: 0, min: -2, max: 4 })
        })
      }),

      // Combat Statistics
      combat: new fields.SchemaField({
        hits: new fields.NumberField({ required: true, integer: true, min: 0, max: 8, initial: 0 }),
        bonusHitLimit: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        bonusDefense: new fields.NumberField({ required: true, integer: true, initial: 0 }),
        bonusInitiative: new fields.NumberField({ required: true, integer: true, initial: 0 }),
        determination: new fields.BooleanField({ initial: true }),
        defenseDiceNote: new fields.StringField({ initial: '' })
      }),

      // Conditions (Stany)
      conditions: new fields.SchemaField({
        downed: new fields.BooleanField({ initial: false }),
        stunned: new fields.BooleanField({ initial: false }),
        exposed: new fields.BooleanField({ initial: false }),
        burning: new fields.BooleanField({ initial: false }),
        frightened: new fields.BooleanField({ initial: false }),
        poisoned: new fields.BooleanField({ initial: false }),
        other: new fields.StringField({ initial: '' })
      }),

      // Personal Resources (Zasoby osobiste)
      resources: new fields.SchemaField({
        gold: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        supplies: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        materials: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        ingredients: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        reputation: new fields.StringField({ initial: '' })
      }),

      // Character Progression (Rozwój)
      development: new fields.SchemaField({
        points: new fields.NumberField({ required: true, integer: true, min: 0, max: 8, initial: 0 }),
        unlockedSlots: new fields.NumberField({ required: true, integer: true, min: 4, max: 6, initial: 4 })
      })
    };
  }

  override prepareDerivedData() {
    // Calculated Defense = 10 + Agility + Card / Gear bonus
    const zrecznosc = this.attributes.zrecznosc.value || 0;
    this.defense = 10 + zrecznosc + (this.combat.bonusDefense || 0);

    // Calculated Hit Limit = Base 3 (+1 if Strength >= 3) + Development / Item bonuses (max 5)
    const sila = this.attributes.sila.value || 0;
    const strengthBonus = sila >= 3 ? 1 : 0;
    this.hitLimit = Math.min(5, 3 + strengthBonus + (this.combat.bonusHitLimit || 0));

    // Auto-update Downed condition if hits reach or exceed limit
    if (this.combat.hits >= this.hitLimit && this.hitLimit > 0) {
      this.conditions.downed = true;
    }
  }
}
