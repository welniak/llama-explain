#!/bin/bash

# Install ollama if needed or exit if homebrew not available
# Check if ollama is installed
if ! which ollama >/dev/null 2>&1; then

    # Check if Homebrew is installed
    if ! which brew >/dev/null 2>&1; then
        echo "You need to install homebrew first."
        exit 1
    fi

    # Install ollama using Homebrew
    brew install ollama
else
    echo "ollama is already installed."
fi

# Add chrome extensions to the accepted origins to allow communication
# between the extension and ollama
VALUE="chrome-extension://*"

# Determine which shell the user is using and set the appropriate profile file
case $SHELL in
    /bin/bash)
        PROFILE_FILE=~/.bash_profile
        ;;
    /bin/zsh)
        PROFILE_FILE=~/.zshrc
        ;;
    /bin/fish)
        # For fish shell, you'd typically set environment variables in ~/.config/fish/config.fish
        PROFILE_FILE=~/.config/fish/config.fish
        ;;
    *)
        echo "Unsupported shell: $SHELL"
        exit 1
        ;;
esac

# Append the export command to the user's profile
if [ "$SHELL" = "/bin/fish" ]; then
    # Fish shell has a different syntax for setting environment variables
    echo "set -gx OLLAMA_ORIGINS $VALUE" >> $PROFILE_FILE
else
    echo "export OLLAMA_ORIGINS=$VALUE" >> $PROFILE_FILE
fi

source "$PROFILE_FILE"

echo "OLLAMA_ORIGINS set for $USER using $SHELL"

# Create the llama explain ollama models
ollama serve &
ollama create llama-explain-llama2:13b -f ../modfiles/llama-explain-llama2-13b-modifle
ollama create llama-explain-llama2:7b -f ../modfiles/llama-explain-llama2-7b-modifle

