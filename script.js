class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.frequency = 0; // Tracks how often the word was added
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.wordCount = 0;
    }

    addWord(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        if (!node.isEndOfWord) {
            node.isEndOfWord = true;
            this.wordCount++;
        }
        node.frequency++;
    }

    _collectAllWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (const char in node.children) {
            this._collectAllWords(node.children[char], prefix + char, words);
        }
    }

    collectAllWords() {
        const words = [];
        this._collectAllWords(this.root, "", words);
        return words;
    }

    reset() {
        this.root = new TrieNode();
        this.wordCount = 0;
    }
}

// Instantiate Trie
const trie = new Trie();

// Save Trie State to a `.txt` File
document.getElementById('saveTrieBtn').addEventListener('click', () => {
    const words = trie.collectAllWords();
    const text = words.join("\n");
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trie-state.txt';
    a.click();
});

// Load Trie State from a `.txt` File
document.getElementById('loadTrieBtn').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const words = text.split(/\r?\n/).filter(word => word.trim().length > 0);
            words.forEach(word => trie.addWord(word.trim()));
            alert(`${words.length} words loaded into the Trie.`);
        };
        reader.readAsText(file);
    }
});

// Other Trie Operations (Add, Search, Delete, etc.)
document.getElementById('addWordBtn').addEventListener('click', () => {
    const wordInput = document.getElementById('wordInput').value.trim();
    const addResult = document.getElementById('addResult');
    if (wordInput) {
        trie.addWord(wordInput);
        addResult.innerHTML = `Added: ${wordInput}. Total words: ${trie.wordCount}`;
        document.getElementById('wordInput').value = '';
    } else {
        addResult.innerHTML = 'Please enter a valid word.';
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    trie.reset();
    document.getElementById('fileAddResult').innerHTML = '';
    document.getElementById('addResult').innerHTML = '';
    document.getElementById('autocompleteInput').value = '';
    document.getElementById('suggestionsList').innerHTML = '';
    document.getElementById('resetResult').innerHTML = 'Trie has been reset.';
});
