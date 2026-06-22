```javascript
const body = $response.body;

if (!body) {
    $done({});
} else {
    try {
        const obj = JSON.parse(body);

        function modify(node) {
            if (!node || typeof node !== "object") {
                return;
            }

            // 识别包含 monsters 数组的关卡配置
            if (Array.isArray(node.monsters)) {
                // 修改金币显示
                if (Object.prototype.hasOwnProperty.call(node, "waveCoin")) {
                    node.waveCoin = 999999999;
                }

                if (
                    Object.prototype.hasOwnProperty.call(node, "coinBase") &&
                    typeof node.coinBase === "number" &&
                    node.coinBase > 0
                ) {
                    node.coinBase = 999999999;
                }

                // monster 格式：[怪物 ID, 难度等级, 出现数量]
                node.monsters.forEach((wave) => {
                    if (!Array.isArray(wave)) {
                        return;
                    }

                    wave.forEach((monster) => {
                        if (!Array.isArray(monster) || monster.length < 3) {
                            return;
                        }

                        // 难度等级设为 1
                        if (typeof monster[1] === "number") {
                            monster[1] = 1;
                        }

                        // 出现数量设为 1
                        if (typeof monster[2] === "number") {
                            monster[2] = 1;
                        }
                    });
                });
            }

            // 递归处理对象和数组
            Object.keys(node).forEach((key) => {
                modify(node[key]);
            });
        }

        modify(obj);

        $done({
            body: JSON.stringify(obj)
        });
    } catch (error) {
        console.log(`[xyzw] JSON 处理失败：${error.message}`);
        $done({});
    }
}
```
