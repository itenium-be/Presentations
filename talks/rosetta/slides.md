---
theme: ../../
title: Rosetta
transition: fade
highlighter: shiki
shikiOptions:
  theme: night-owl
---

# Rosetta
# Code Themes Showcase

---
layout: code
---

# TypeScript

```ts
interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>
  save(entity: T): Promise<T>
}

class UserRepository implements Repository<User> {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query<UserRow>(
      `SELECT * FROM users WHERE id = $1`, [id]
    )
    return row ? this.toEntity(row) : null
  }

  async save(entity: User): Promise<User> {
    const row = await this.db.upsert('users', this.toRow(entity))
    return this.toEntity(row)
  }

  private toEntity = (row: UserRow): User => ({
    id: row.id,
    name: `${row.first_name} ${row.last_name}`,
    isActive: row.status === 'active',
  })
}
```

---
layout: code
---

# C\#

```csharp
public record WeatherForecast(
    DateOnly Date,
    int TemperatureC,
    string? Summary
) {
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class WeatherService(
    IHttpClientFactory httpFactory,
    ILogger<WeatherService> logger)
{
    public async Task<IReadOnlyList<WeatherForecast>> GetForecastAsync(
        string city, CancellationToken ct = default)
    {
        using var client = httpFactory.CreateClient("weather");
        logger.LogInformation("Fetching forecast for {City}", city);

        var response = await client.GetAsync($"/api/forecast/{city}", ct);
        response.EnsureSuccessStatusCode();

        return await response.Content
            .ReadFromJsonAsync<List<WeatherForecast>>(ct) ?? [];
    }
}
```

---
layout: code
---

# React

```tsx
interface Props {
  items: TodoItem[]
  onToggle: (id: string) => void
}

export function TodoList({ items, onToggle }: Props) {
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const filtered = useMemo(
    () => items.filter(item =>
      filter === 'all' ? true
        : filter === 'done' ? item.completed
        : !item.completed
    ),
    [items, filter],
  )

  return (
    <section className="todo-list">
      <ul>
        {filtered.map(item => (
          <li key={item.id} className={item.completed ? 'done' : ''}>
            <input type="checkbox" checked={item.completed}
              onChange={() => onToggle(item.id)} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

---
layout: code
---

# HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="/styles/main.css" />
</head>
<body>
  <header class="top-bar">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </nav>
  </header>
  <main id="content">
    <h1>Monthly Report</h1>
    <p>Revenue: &euro;142,500 <span data-trend="up">+12.3%</span></p>
  </main>
</body>
</html>
```

---
layout: code
---

# CSS

```css
:root {
  --radius: 0.5rem;
  --shadow: 0 2px 8px oklch(0% 0 0 / 0.08);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

.card {
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: transform 0.3s var(--ease-out),
              box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px oklch(0% 0 0 / 0.12);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

---
layout: code
---

# Python

```python
from dataclasses import dataclass, field
from pathlib import Path
import asyncio
import httpx

@dataclass
class Config:
    base_url: str
    timeout: float = 30.0
    retries: int = 3
    headers: dict[str, str] = field(default_factory=dict)

class ApiClient:
    def __init__(self, config: Config) -> None:
        self._config = config
        self._client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=config.timeout,
            headers=config.headers,
        )

    async def fetch(self, endpoint: str) -> dict:
        for attempt in range(self._config.retries):
            try:
                resp = await self._client.get(endpoint)
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code < 500:
                    raise
                await asyncio.sleep(2 ** attempt)
```
