# About
llama explain is a Chrome extension that explains complex text online in simple terms, by using a local-running LLM. All is done locally on your machine. No data is sent to OpenAI's, or any other company's, server. No need to pay for any service.

It's built on top of [Ollama](https://github.com/jmorganca/ollama) and as such, currently runs only on MacOS.

![explain](https://github.com/welniak/llama-explain/assets/13221950/d66b6a19-5de7-40ed-a9f6-79e22b07903d)

![pick_model](https://github.com/welniak/llama-explain/assets/13221950/e2a0776e-faac-44dc-a646-e146662d26f9)

# Prerequisites
When using the installation script:
- [Homebrew](https://brew.sh/)

When installing manually:
- [Ollama](https://github.com/jmorganca/ollama)

# Set up
You can install the extension directly from the store (coming soon) or [load the unpacked extension in your browser](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) (the extension directory).

The rest of the setup can be done either by using the `setup.sh` script or manually.

## Using the script (recommended)
The script will install Ollama for you using Homebrew, create appropriate models based on Lllama2, and export the environment variable that the extension needs to communicate with Ollama. 

To run the script:
1. Navigate to the `setup` directory
2. Make the script executable, by running
   ```bash
   chmod +x setup.sh
   ```
3. Run the script:
   ```bash
   source setup.sh
   ```

In case you run into the `operation not permitted` error while trying to execute the steps above, run

```bash
xattr -d com.apple.quarantine setup.sh
```

from inside of the `setup` directory.

## Manual
If you opt for not using the setup script, you can perform all the steps manually:
1. Install [Ollama](https://github.com/jmorganca/ollama)
2. Set the `OLLAMA_ORIGINS` environment variable to `"chrome-extension://*"`. This is needed to allow the extension to communicate with Ollama
3. Create the Ollama models based on the provided Modelfiles. Run:
   ```bash
   ollama create llama-explain-llama2:13b -f ../modelfile/llama-explain-llama2-13b-modelfile
   ollama create llama-explain-llama2:7b -f ../modelfile/llama-explain-llama2-7b-modelfile
   ```

   from inside of the `modelfile` directory.

   Note that only a single model is required by the extension. By default, it comes with two Modelfiles: one based on Llama2 7b, and the other based on Llama2 13b. You can pick just one of the two, or create yet another Ollama model for the task. If you opt for a custom model, make sure that the name has a `llama-explain` prefix.
