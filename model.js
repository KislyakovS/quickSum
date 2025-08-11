export class OpenAI {
  constructor({ url, apiKey, model }) {
    this.url = url;
    this.apiKey = apiKey;
    this.model = model;
  }

  getHeadersFetch() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  transformStreamToMessage() {
    return new TransformStream({
      transform(chunk, controller) {
        const decoder = new TextDecoder();
        const data = decoder.decode(chunk, { stream: true });

        controller.enqueue(
          data
            .split("\n")
            .filter((line) => line.startsWith("data: "))
            .map((str) => {
              const jsonStr = str.slice(6);
              if (jsonStr === "[DONE]") {
                return { done: true };
              } else {
                return { content: JSON.parse(jsonStr), done: false };
              }
            })
            .map((parsed) => {
              if (parsed.done) {
                return "";
              }

              return parsed.content.choices[0].delta.content;
            })
            .join(""),
        );
      },
    });
  }

  writableStreamMessage(write) {
    return new WritableStream({
      write,
    });
  }

  async chat(messages, { onMessage, onError }) {
    try {
      const response = await fetch(`${this.url}/chat/completions`, {
        method: "POST",
        headers: this.getHeadersFetch(),
        body: JSON.stringify({
          model: this.model,
          stream: true,
          messages,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error?.message);
      }

      response.body
        .pipeThrough(this.transformStreamToMessage())
        .pipeTo(this.writableStreamMessage(onMessage));
    } catch (e) {
      onError(e);
    }
  }
}
