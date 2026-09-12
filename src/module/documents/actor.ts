/**
 * Custom Actor document for BarDaMIgo.
 */
export class BarDaMIgoActor extends Actor {
  /**
   * Perform an Attribute Check roll.
   */
  async rollAttribute(attributeKey: 'sila' | 'zrecznosc' | 'umysl' | 'wola', rollType: 'normal' | 'advantage' | 'disadvantage' = 'normal', targetDC?: number) {
    const attr = (this.system as any).attributes?.[attributeKey];
    const mod = attr ? attr.value : 0;
    const attrLabelKey = `BARDAMIGO.Attributes.${attributeKey.charAt(0).toUpperCase() + attributeKey.slice(1)}`;
    const attrLabel = game.i18n.localize(attrLabelKey) || attributeKey;

    let formula = '1d20';
    if (rollType === 'advantage') formula = '2d20kh1';
    else if (rollType === 'disadvantage') formula = '2d20kl1';

    const fullFormula = `${formula} + ${mod}`;
    const roll = new Roll(fullFormula, { mod });
    await roll.evaluate();

    const d20Die = roll.dice[0];
    const naturalResult = d20Die ? d20Die.results.find(r => r.active)?.result : null;
    const total = roll.total;

    let evaluation = '';
    let evaluationClass = '';

    if (naturalResult === 20) {
      evaluation = game.i18n.localize('BARDAMIGO.Roll.GreatSuccess');
      evaluationClass = 'critical-success';
    } else if (naturalResult === 1) {
      evaluation = game.i18n.localize('BARDAMIGO.Roll.Complication');
      evaluationClass = 'critical-failure';
    } else if (targetDC !== undefined && targetDC !== null) {
      if (total >= targetDC) {
        evaluation = game.i18n.localize('BARDAMIGO.Roll.Success');
        evaluationClass = 'success';
      } else if (targetDC - total <= 2) {
        evaluation = game.i18n.localize('BARDAMIGO.Roll.SuccessWithCost');
        evaluationClass = 'success-cost';
      } else {
        evaluation = game.i18n.localize('BARDAMIGO.Roll.Failure');
        evaluationClass = 'failure';
      }
    }

    const rollTypeLabel = game.i18n.localize(`BARDAMIGO.Roll.${rollType.charAt(0).toUpperCase() + rollType.slice(1)}`);
    const flavor = `${game.i18n.format('BARDAMIGO.Roll.Check', { attribute: attrLabel })} [${rollTypeLabel}]`;

    const content = `
      <div class="bardamigo-chat-card">
        <div class="card-header">
          <strong>${flavor}</strong>
          ${targetDC ? `<span class="dc-badge">DC ${targetDC}</span>` : ''}
        </div>
        <div class="dice-roll">
          <div class="dice-result">
            <h4 class="dice-total ${evaluationClass}">${total}</h4>
            ${evaluation ? `<div class="roll-eval ${evaluationClass}">${evaluation}</div>` : ''}
          </div>
        </div>
      </div>
    `;

    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      content
    });
  }

  /**
   * Perform a Defense Die roll (on 4+ ignore hit).
   */
  async rollDefense(die: string, sourceName: string = 'Defense') {
    if (!die || die === 'none') return;

    const roll = new Roll(`1${die}`);
    await roll.evaluate();
    const result = roll.total;

    const isIgnored = result >= 4;
    const evaluation = isIgnored
      ? game.i18n.format('BARDAMIGO.DefenseRolls.Success', { result })
      : game.i18n.format('BARDAMIGO.DefenseRolls.Failure', { result });
    const evalClass = isIgnored ? 'success' : 'failure';

    const flavor = `${game.i18n.localize('BARDAMIGO.DefenseRolls.Label')}: ${sourceName} (1${die})`;
    const content = `
      <div class="bardamigo-chat-card">
        <div class="card-header">
          <strong>${flavor}</strong>
        </div>
        <div class="dice-roll">
          <div class="dice-result">
            <h4 class="dice-total ${evalClass}">${result}</h4>
            <div class="roll-eval ${evalClass}">${evaluation}</div>
          </div>
        </div>
      </div>
    `;

    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      content
    });
  }

  /**
   * Short Rest: Remove 1 Hit.
   */
  async shortRest() {
    const currentHits = (this.system as any).combat?.hits || 0;
    if (currentHits > 0) {
      await this.update({ 'system.combat.hits': currentHits - 1 });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<strong>${this.name}</strong> ${game.i18n.localize('BARDAMIGO.Rest.ShortRestDesc')}.`
      });
    }
  }

  /**
   * Long Rest: Remove all Hits & restore Determination.
   */
  async longRest() {
    await this.update({
      'system.combat.hits': 0,
      'system.combat.determination': true,
      'system.conditions.downed': false
    });
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<strong>${this.name}</strong> ${game.i18n.localize('BARDAMIGO.Rest.LongRestDesc')}.`
    });
  }
}
