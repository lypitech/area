<img src="/md/assets/AREA_1024.png" width=72 alt="Logo of the application"/>

# DEV-500 ‒ `AREA` ‒ How to contribute

# Ajouter un nouveau service (Trigger Driver)

## Principe

Chaque service apporte un **driver** qui implémente un contrat commun et s'enregistre automatiquement dans le **registry** via un multi-provider (`TRIGGER_DRIVERS`).

Le core (`TriggerModule` et `TriggerService`) n'a aucune dépendance directe vers vos services.

<aside>

**Structure des fichiers :**

```
trigger/
  contracts/trigger-driver.ts
  tokens.ts
  trigger.module.ts
  trigger.service.ts
  services/
    <votre-service>/
      <service>.driver.ts
      <service>;.module.ts
      (optionnel) <service>.controller.ts
```

</aside>

---

## 1. Contrat à implémenter

Tous les drivers doivent implémenter l'interface `TriggerDriver` :

```tsx
// trigger/contracts/trigger-driver.ts
export interface TriggerDriver {
  readonly key: string;                     // ex: 'discord:webhook'
  supports(trigger: Trigger): boolean;      // si ce driver gère ce trigger
  onCreate?(t: Trigger, params?: any): Promise&lt;void&gt;;
  onRemove?(t: Trigger): Promise&lt;void&gt;;
  fire?(t: Trigger, payload?: any): Promise&lt;void&gt;;
}
```

---

## 2. Token du registry

Le token permet d'injecter tous les drivers dans le service principal :

```tsx
// trigger/tokens.ts
export const TRIGGER_DRIVERS = Symbol('TRIGGER_DRIVERS');
```

---

## 3. Créer votre driver

### Exemple : Discord Webhook

```tsx
// trigger/services/discord/discord.driver.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { Trigger } from '../../schemas/trigger.schema';

@Injectable()
export class DiscordWebhookDriver implements TriggerDriver {
  readonly key = 'discord:webhook';

  supports(t: Trigger) {
    return t.service_name === 'discord' &amp;&amp; t.trigger_type === 'webhook';
  }

  async onCreate(t: Trigger) {
    // Optionnel : enregistrer un webhook côté Discord si besoin
    // Utilisez t.input pour la config (ex: { channelId, secret }).
  }

  async onRemove(t: Trigger) {
    // Optionnel : supprimer le webhook côté Discord
  }

  async fire(t: Trigger, payload?: any) {
    const url = t.input?.webhookUrl;
    if (!url) throw new UnauthorizedException('Webhook URL manquant');
    // Exemple : envoyer un message via un webhook Discord
    // await axios.post(url, { content: String(payload ?? '') });
  }
}
```

<aside>

**Le champ `input` du modèle Trigger** contient toute la configuration spécifique à ce service.

**Exemples :**

- `{ webhookUrl: "...", channelId: "..." }`
- `{ every: 5 }`
- `{ repo: "myrepo", event: "push" }`
</aside>

---

## 4. Créer le module du service

```tsx
// trigger/services/discord/discord.module.ts
import { Module } from '@nestjs/common';
import { TRIGGER_DRIVERS } from '../../tokens';
import { DiscordWebhookDriver } from './discord.driver';

@Module({
  providers: [
    DiscordWebhookDriver,
    { provide: TRIGGER_DRIVERS, useExisting: DiscordWebhookDriver },
  ],
  exports: [],
})
export class DiscordModule {}
```

Ce provider multi-instance permet à Nest d'injecter tous les drivers enregistrés dans le `TriggerService`.

---

## 5. Brancher le module dans le core

```tsx
// trigger/trigger.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    // autres services déjà existants
    DiscordModule,   // ajoute votre service ici
  ],
  providers: [TriggerService],
  exports: [TriggerService],
})
export class TriggerModule {}
```

---

## 6. Exemple de création et d'utilisation

### Modèle Trigger (extrait)

```tsx
@Prop({ type: MongooseSchema.Types.Mixed, default: {} })
input?: Record&lt;string, any&gt; | null;
```

### Création d'un trigger

```tsx
// Exemple : webhook Discord
await triggerService.create({
  service_name: 'discord',
  name: 'notify-on-event',
  trigger_type: 'webhook',
  input: { webhookUrl: 'https://discordapp.com/api/webhooks/...' },
});

// Exemple : trigger interval
await triggerService.create({
  service_name: 'area',
  name: 'heartbeat',
  trigger_type: 'interval',
  input: { every: 10 },
});
```

### Déclenchement

- **Webhook entrant :** via un contrôleur HTTP → `triggerService.fire(uuid, body)`
- **Interval :** déclenché automatiquement par le driver interval

---

## 7. (Optionnel) Contrôleur webhook

Si votre service reçoit des webhooks externes :

```tsx
// trigger/services/discord/discord.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { TriggerService } from '../../trigger.service';

@Controller('hooks/discord')
export class DiscordWebhookController {
  constructor(private readonly triggers: TriggerService) {}

  @Post(':uuid')
  async inbound(@Param('uuid') uuid: string, @Body() body: any) {
    // TODO: vérifier la signature si nécessaire
    return this.triggers.fire(uuid, body);
  }
}
```

<aside>

N'oubliez pas d'ajouter le contrôleur dans le `DiscordModule` :

```tsx
@Module({
  controllers: [DiscordWebhookController],
  providers: [
    DiscordWebhookDriver,
    { provide: TRIGGER_DRIVERS, useExisting: DiscordWebhookDriver },
  ],
})
export class DiscordModule {}
```

</aside>

---

## 8. Checklist rapide

| **Vérification** | **Description** |
| --- | --- |
| `supports()` | Retourne true/false selon service_name et trigger_type |
| `onCreate()` | Configure la ressource externe (webhook, cron, etc.) |
| `onRemove()` | Supprime la ressource distante proprement |
| `fire()` | Exécute la logique de déclenchement |
| Module | Fournit`{ provide: TRIGGER_DRIVERS, useExisting: ... }` |
| Tests | Création / suppression / déclenchement fonctionnels |
| Logs | Chaque driver utilise Logger pour traçabilité |

---

## 9. Exemple minimal complet

- **Driver**
    
    ```tsx
    // trigger/services/myservice/myservice.driver.ts
    import { Injectable } from '@nestjs/common';
    import { TriggerDriver } from '../../contracts/trigger-driver';
    import { Trigger } from '../../schemas/trigger.schema';
    
    @Injectable()
    export class MyServiceWebhookDriver implements TriggerDriver {
      readonly key = 'myservice:webhook';
    
      supports(t: Trigger) {
        return t.service_name === 'myservice' &amp;&amp; t.trigger_type === 'webhook';
      }
    
      async onCreate(t: Trigger) {
        // Setup distant (si nécessaire)
      }
    
      async fire(t: Trigger, payload?: any) {
        // Votre logique métier ici
      }
    }
    ```
    
- **Module**
    
    ```tsx
    // trigger/services/myservice/myservice.module.ts
    import { Module } from '@nestjs/common';
    import { TRIGGER_DRIVERS } from '../../tokens';
    import { MyServiceWebhookDriver } from './myservice.driver';
    
    @Module({
      providers: [
        MyServiceWebhookDriver,
        { provide: TRIGGER_DRIVERS, useExisting: MyServiceWebhookDriver },
      ],
    })
    export class MyServiceModule {}
    ```
    
- **Controller (optionnel)**
    
    ```tsx
    // trigger/services/myservice/myservice.controller.ts
    import { Controller, Post, Param, Body } from '@nestjs/common';
    import { TriggerService } from '../../trigger.service';
    
    @Controller('hooks/myservice')
    export class MyServiceController {
      constructor(private readonly triggers: TriggerService) {}
    
      @Post(':uuid')
      async inbound(@Param('uuid') uuid: string, @Body() body: any) {
        return this.triggers.fire(uuid, body);
      }
    }
    ```
    

---

