import type { Article, Draft } from './model';
export class SaveQueue {
  current: Draft;
  dirty = false;
  blocked = false;
  private running: Promise<void> | null = null;
  private publishPending = false;
  constructor(
    initial: Draft,
    private send: (
      data: Article,
      revision: number,
      publish: boolean,
    ) => Promise<Draft>,
    private changed: (draft: Draft) => void,
  ) {
    this.current = initial;
  }
  edit(data: Article) {
    this.current = { ...this.current, data };
    this.dirty = true;
    this.changed(this.current);
  }
  save(publish = false): Promise<void> {
    if (this.blocked)
      return Promise.reject(
        new Error('Résolvez le conflit avant de continuer.'),
      );
    this.publishPending ||= publish;
    if (this.running) return this.running;
    this.running = this.drain().finally(() => {
      this.running = null;
    });
    return this.running;
  }
  private async drain() {
    while (this.dirty || this.publishPending) {
      const sent = this.current;
      const publish = this.publishPending;
      this.publishPending = false;
      try {
        const canonical = await this.send(sent.data, sent.revision, publish);
        const latest = this.current.data;
        // Only edits made during the request are layered over the canonical response.
        const edits = Object.fromEntries(
          Object.keys(latest)
            .filter(
              (k) => JSON.stringify(latest[k]) !== JSON.stringify(sent.data[k]),
            )
            .map((k) => [k, latest[k]]),
        );
        this.dirty = Object.keys(edits).length > 0;
        this.current = { ...canonical, data: { ...canonical.data, ...edits } };
        this.changed(this.current);
      } catch (error) {
        this.publishPending = false;
        throw error;
      }
    }
  }
}
