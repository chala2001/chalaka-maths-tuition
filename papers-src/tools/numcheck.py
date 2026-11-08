"""Compare the numbers used in an English doc and its Sinhala source (maths must be identical)."""
import re, sys, collections
sys.stdout.reconfigure(encoding="utf-8")
def nums(path):
    t = open(path, encoding="utf-8").read()
    t = re.sub(r"<script.*?</script>", " ", t, flags=re.S)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"&\w+;", " ", t)
    return collections.Counter(re.findall(r"\d+(?:\.\d+)?", t))
for en in sys.argv[1:]:
    si = en.replace("-en-", "-si-")
    a, b = nums(en), nums(si)
    diff = {k: (a[k], b[k]) for k in set(a) | set(b) if a[k] != b[k]}
    print(en.split("/")[-1], "numbers identical" if not diff else f"DIFF en/si counts: {dict(sorted(diff.items())[:25])}")
