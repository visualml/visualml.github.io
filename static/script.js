var datasetInfo = {'mnist': {'input_size': [28, 28, 1],
                'output_size': 10}, 'cifar': {'input_size': [32, 32,
                3], 'output_size': 10}}

var cifarDict = [
    'Frog',
    'Truck',
    'Deer',
    'Automobile',
    'Bird',
    'Horse',
    'Ship',
    'Cat',
    'Airplane',
    'Dog'
]

var loss = function (data) {
    $("#loading-text").html("Loss: " + data);
}

var id = function (data) {
    console.log('ID: ' + data);
    $("#loading").hide();
    window.location.href = "#" + data;
}

var elem = document.getElementById('canvas');

var two = new Two({
    width: $(window).width() - $("#sidebar").width(),
    height: $(window).height() - $("#toolbar").height()
}).appendTo(elem);

$(two.renderer.domElement).css("background", `url(${generateGrid()}) center center`);

var sidebarElement = document.getElementById('sidebar');

function editEpochs() {
    network["info"]["epochs"] = parseInt(document.getElementById("sb-epoch").value);
    console.log(JSON.stringify(network))
}

function editDataset() {
    network["info"]["dataset"] = document.getElementById("sb-dataset").value;
    console.log(JSON.stringify(network))
}

function editBatchSize() {
    network["info"]["batch_size"] = parseInt(document.getElementById(
        "sb-batch-size").value);
    console.log(JSON.stringify(network))
}

function editLayerSize(index) {
    network["layers"][index]["size"] = parseInt(document.getElementById(
        "sb-layer-size").value);
    console.log(JSON.stringify(network))
}

function editFilterSize(index) {
    network["layers"][index]["filter_size"] = parseInt(document.getElementById(
        "sb-filter-size").value);
    console.log(JSON.stringify(network))
}

function editPoolingSize(index) {
    network["layers"][index]["pool_size"] = parseInt(document.getElementById(
        "sb-pool-size").value);
    console.log(JSON.stringify(network))
}

function editActivation(index) {
    network["layers"][index]["activation"] = document.getElementById(
        "sb-activation").value;
    console.log(JSON.stringify(network))
}

var displaySidebar = function (id) {
    sidebarElement.innerHTML = ""
    if (id === -2) {
        sidebarElement.innerHTML =
            `
            <div class="field">
                <label class="label">Epochs</label>
                <div class="control">
                    <input class="input" type="number" id="sb-epoch"
                        placeholder="Epochs" value="${network["info"]["epochs"]}" onchange="editEpochs()">
                </div>
            </div>

            <div class="field">
                <label class="label">Dataset</label>
                <div class="control">
                    <div class="select">
                        <select id="sb-dataset" onchange="editDataset()">
                            <option disabled>Dataset</option>
                            <option value="mnist" ${network["info"]["dataset"] === "mnist" ? "selected" : ""}>MNIST</option>
                            <option value="cifar" ${network["info"]["dataset"] === "cifar" ? "selected" : ""}>CIFAR-10</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="field">
                <label class="label">Batch Size</label>
                <div class="control">
                    <input class="input" type="number" id="sb-batch-size"
                        placeholder="Batch Size" value="${network["info"]["batch_size"]}" onchange="editBatchSize()">
                </div>
            </div>
        `
    } else if (id === -1) {
        var input_size = network["info"]["dataset"] == "mnist" ? [28, 28, 1] : [32, 32, 3]
        sidebarElement.innerHTML =
            `
            <div class="field">
                <label class="label">Image Size (readonly)</label>
                <div class="control">
                    <input class="input" type="text" id="sb-image-size" readonly
                        placeholder="Image Size" value="(${input_size[0]}, ${input_size[1]})">
                </div>
            </div>
        `
    } else if (id === network["layers"].length) {
        sidebarElement.innerHTML =
            `
            <div class="field">
                <label class="label">Output Size (readonly)</label>
                <div class="control">
                    <input class="input" type="number" id="sb-output-size" readonly
                        placeholder="Output Size" value="${network["info"]["output_size"]}">
                </div>
            </div>
        `
    } else {
        Object.keys(network["layers"][id]).forEach(function (key) {
            if (key === "type") {
                var title = document.createElement('h1')
                title.className = "title"
                var types = {
                    "conv": "Convolutional Layer",
                    "nn": "Neural Layer",
                    "pool": "Pooling Layer",
                    "flatten": "Flattening Layer"
                }
                title.innerHTML = types[network["layers"][id][key]];
                sidebarElement.appendChild(title);
            } else if (key === "size") {
                var field = document.createElement('div')
                field.className = "field"
                field.innerHTML =
                    `
                    <label class="label">Number of Nodes</label>
                    <div class="control">
                        <input class="input" type="number" id="sb-layer-size"
                            placeholder="Number of Nodes" value="${network["layers"][id][key]}" onchange="editLayerSize(${id})">
                    </div>
                `
                sidebarElement.appendChild(field);
            } else if (key === "filter_size") {
                var field = document.createElement('div')
                field.className = "field"
                field.innerHTML =
                    `
                    <label class="label">Filter Size</label>
                    <div class="control">
                        <input class="input" type="number" id="sb-filter-size"
                            placeholder="Filter Size" value="${network["layers"][id][key]}" onchange="editFilterSize(${id})">
                    </div>
                `
                sidebarElement.appendChild(field);
            } else if (key === "pool_size") {
                var field = document.createElement('div')
                field.className = "field"
                field.innerHTML =
                    `
                    <label class="label">Pooling Size</label>
                    <div class="control">
                        <input class="input" type="number" id="sb-pool-size"
                            placeholder="Pooling Size" value="${network["layers"][id][key]}" onchange="editPoolingSize(${id})">
                    </div>
                `
                sidebarElement.appendChild(field);
            } else if (key === "activation") {
                var field = document.createElement('div')
                field.className = "field"
                field.innerHTML =
                    `
                    <label class="label">Activation Function</label>
                    <div class="control">
                        <div class="select">
                            <select id="sb-activation" onchange="editActivation(${id})">
                                <option disabled>Activation</option>
                                <option value="relu" ${network["layers"][id][key] == "relu" ? "selected" : ""}>ReLU</option>
                                <option value="tanh" ${network["layers"][id][key] == "tanh" ? "selected" : ""}>Tanh</option>
                                <option value="sigmoid" ${network["layers"][id][key] == "sigmoid" ? "selected" : ""}>Sigmoid</option>
                                <option value="linear" ${network["layers"][id][key] == "linear" ? "selected" : ""}>None</option>
                            </select>
                        </div>
                    </div>
                `
                sidebarElement.appendChild(field);
            }
        })
    }

    var layer = network["layers"][id];


}


var renderNetwork = function (added) {
    var input_size = network["info"]["dataset"] == "mnist" ? [28, 28, 1] : [32, 32, 3]
    var boxWidth = 50
    var boxHeight = 500
    var spacing = 75
    var fillColor = "#b5b5b5"
    var strokeColor = "#999999"
    var layers = []
    var connections = []
    var addListeners = []
    var networkGroup = new Two.Group()

    two.clear()
    var backgroundRECTANGLE = two.makeRectangle(two.width / 2, two.height /
        2, two.width, two.height)

    backgroundRECTANGLE.noFill();
    backgroundRECTANGLE.noStroke();
    two.update()

    var addDeliciousListener = function (object, listener, func) {
        addListeners.push({
            id: object.id,
            listener: listener,
            func: func
        })
    }

    var updateAll = function () {
        two.update()

        for (var i = 0; i < addListeners.length; i++) {
            try {
                var listener = addListeners[i]
                var element = document.querySelector("#" + listener.id)
                element.addEventListener(listener.listener, listener.func)
            } catch (e) {;
            }
        }

        addListeners = []
    }

    var makeArrow = function (x1, y1, x2, y2) {
        var group = new Two.Group()
        var ln = two.makeLine(x1, y1, x2, y2)
        ln.stroke = "#FF7700"
        ln.linewidth = boxWidth / 10
        group.add(ln)
        var d = boxWidth / 4
        var tri = two.makePolygon(x2, y2, boxWidth / 4, 3)
        tri.stroke = "#FF7700"
        tri.fill = "#ffa33a"
        tri.linewidth = boxWidth / 10
        tri.rotation = -30 / 180 * Math.PI + Math.atan2(y2 - y1, x2 -
            x1)
        group.add(tri)
        return group
    }

    var renderLayer = function (id) {
        if (id === 0 || id === compoundwork['layers'].length-1) {
            var fColor = "#77a9f9"
            var sColor = "#5994f2"
        }else{
            var fColor = fillColor
            var sColor = strokeColor
        }
        var layer = compoundwork["layers"][id]
        var group = new Two.Group()
        var sz = layer["size"]
        var topLeft = (id + 1) * (boxWidth + spacing)
        var vertSpacing = boxHeight / (sz + 1)
        if (layer["type"] === "nn") {
            if (sz < 5) {
                for (var i = 0; i < sz; i++) {
                    var circle = two.makeCircle(boxWidth / 2, (i + 1) *
                        vertSpacing, boxWidth / 2)
                    circle.fill = fColor
                    circle.stroke = sColor
                    circle.linewidth = boxWidth / 10
                    group.add(circle)
                }
            } else {
                var vertSpacing = boxHeight / 6
                for (var i = 0; i < 5; i++) {
                    if (i === 2) {
                        var ellipses = new Two.Group()
                        var x = boxWidth / 2
                        var y = (i + 1) * vertSpacing
                        for (var j = 0; j < 3; j++) {
                            var circle = two.makeCircle(0, .75 *
                                boxWidth / 2 * (j - 1), boxWidth /
                                2 / 7.5)
                            circle.fill = fColor
                            circle.stroke = sColor
                            circle.linewidth = boxWidth / 4 / 5
                            ellipses.add(circle)
                        }
                        ellipses.translation.set(x, y)
                        ellipses.center()
                        group.add(ellipses)
                    } else {
                        var circle = two.makeCircle(boxWidth / 2, (i +
                            1) * vertSpacing, boxWidth / 2)
                        circle.fill = fColor
                        circle.stroke = sColor
                        circle.linewidth = boxWidth / 10
                        group.add(circle)
                    }
                }
            }
        } else if (layer["type"] === "conv") {
            makeRect = function () {
                var rect = two.makeRectangle(boxWidth / 2, (i + 1) *
                    vertSpacing, boxWidth, boxWidth)
                rect.fill = fColor
                rect.stroke = sColor
                rect.linewidth = boxWidth / 10
                group.add(rect)
                var cross = new Two.Group()
                var ln = two.makeLine(0, (i + 1) * vertSpacing,
                    boxWidth, (i + 1) * vertSpacing)
                ln.stroke = sColor
                ln.linewidth = boxWidth / 20
                cross.add(ln)
                var ln = two.makeLine(boxWidth / 2, (i + 1) *
                    vertSpacing - boxWidth / 2, boxWidth / 2, (
                        i + 1) * vertSpacing + boxWidth / 2)
                ln.stroke = sColor
                ln.linewidth = boxWidth / 20
                cross.add(ln)
                group.add(cross)
            }
            if (sz < 5) {
                for (var i = 0; i < sz; i++) {
                    makeRect()
                }
            } else {
                var vertSpacing = boxHeight / 6
                for (var i = 0; i < 5; i++) {
                    if (i === 2) {
                        var ellipses = new Two.Group()
                        var x = boxWidth / 2
                        var y = (i + 1) * vertSpacing
                        for (var j = 0; j < 3; j++) {
                            var circle = two.makeCircle(0, .75 *
                                boxWidth / 2 * (j - 1), boxWidth /
                                2 / 7.5)
                            circle.fill = fColor
                            circle.stroke = sColor
                            circle.linewidth = boxWidth / 4 / 5
                            ellipses.add(circle)
                        }
                        ellipses.translation.set(x, y)
                        ellipses.center()
                        group.add(ellipses)
                    } else {
                        makeRect()
                    }
                }
            }
        } else if (layer["type"] === "flatten") {
            group.add(makeArrow(0, boxHeight / 2, 3 * boxWidth / 4,
                boxHeight / 2));
        } else if (layer["type"] === "pool") {
            group.add(makeArrow(-1, boxHeight / 4, 3 * boxWidth / 4, 7 *
                boxHeight / 16));
            group.add(makeArrow(-1, 3 * boxHeight / 4, 3 * boxWidth / 4,
                9 * boxHeight / 16));
        }
        group.translation.set(topLeft, 0)
        return group
    }

    var connectionspacing = 10

    displaySidebar(-2)
    var EXTREMEBAR

    addDeliciousListener(backgroundRECTANGLE, "click", function () {
        if (EXTREMEBAR) {
            two.remove(EXTREMEBAR)
            two.update()
            displaySidebar(-2)
        }
    })

    var toNet = function(nitwork){
        nitwork["layers"] = nitwork["layers"].slice(1, nitwork["layers"].length -1)
        return nitwork
    }

    var sideBAR = function (id) {
        return function () {
            var topLeft = (id + 1) * (boxWidth + spacing)
            two.remove(EXTREMEBAR)
            EXTREMEBAR = two.makeRectangle(networkGroup.scale * (
                    topLeft + boxWidth / 2), two.height / 2,
                networkGroup.scale * (boxWidth + 30),
                networkGroup.scale * (boxHeight * 2 / 3 +
                    boxWidth + 30))
            EXTREMEBAR.fill = 'rgba(243, 216, 107, .5)'
            EXTREMEBAR.stroke = 'rgb(243, 216, 107)'
            EXTREMEBAR.linewidth = boxWidth / 10
            two.update()
            displaySidebar(id - 1)
        }
    }
    compoundwork = JSON.parse(JSON.stringify(network))
    
    compoundwork["layers"].push({
        "type": "nn",
        "size": network["info"]["output_size"],
        "activation": "relu"
    })
    compoundwork["layers"].unshift({
        "type": "conv",
        "size": input_size,
        "activation": "relu"
    })
    for (var a = 0; a < compoundwork["layers"].length; a++) {
        layers.push(renderLayer(a))
        if (a > 0) {
            var addPlusSign = function () {
                var sColor = "#2ECC71"
                var plussign = new Two.Group()
                var circle = two.makeCircle(0, 0, spacing / 5)
                circle.fill = "#ABEBC6"
                circle.stroke = sColor
                circle.linewidth = spacing / 24
                plussign.add(circle)

                var jojobaadd = function(add, id) {
                    return function () {
                        console.log("a", network)
                        if (add === 1) {
                            network["layers"].splice(id-1, 0, {
                                "type": "nn",
                                "size": 10,
                                "activation": "relu"
                            })
                        } else if (add === 2) {
                            network["layers"].splice(id-1, 0, {
                                "type": "conv",
                                "size": 10,
                                "filter_size": 3,
                                "activation": "relu"
                            })
                        } else if (add === 3) {
                            network["layers"].splice(id-1, 0, {
                                "type": "flatten"
                            })
                        } else if (add === 4) {
                            network["layers"].splice(id-1, 0, {
                                "type": "pool",
                                "pool_size": 2
                            })
                        }
                        console.log("a", network)
                        renderNetwork()
                    }
                }

                addDeliciousListener(plussign, "click", jojobaadd(added, a))

                var lv = two.makeLine(0, -1 * spacing / 7, 0, spacing /
                    7)
                lv.stroke = sColor
                lv.linewidth = spacing / 24
                plussign.add(lv)
                var lh = two.makeLine(-1 * spacing / 7, 0, spacing / 7,
                    0)
                lh.stroke = sColor
                lh.linewidth = spacing / 24
                plussign.add(lh)
                plussign.center()
                plussign.translation.set((layers[a - 1].translation.x +
                        layers[a].translation.x + boxWidth) / 2,
                    layers[a - 1].translation.y + boxHeight / 2)
                networkGroup.add(plussign)
            }
            var addMinusSign = function () {
                var sColor = "#E74C3C"
                var plussign = new Two.Group()
                var circle = two.makeCircle(0, 0, spacing / 5)
                circle.fill = "#F5B7B1"
                circle.stroke = sColor
                circle.linewidth = spacing / 24
                plussign.add(circle)

                function jojoba(id) {
                    return function () {
                        network["layers"].splice(id-1, 1)
                        renderNetwork()
                    }
                }

                addDeliciousListener(plussign, "click", jojoba(a))

                var lh = two.makeLine(-1 * spacing / 7, 0, spacing / 7, 0)
                var lv = two.makeLine(0, -1 * spacing / 7, 0, spacing / 7)
                lh.stroke = sColor
                lh.linewidth = spacing / 24
                lv.stroke = sColor
                lv.linewidth = spacing / 24
                plussign.add(lh, lv)
                plussign.center()
                plussign.rotation = Math.PI / 4;
                plussign.translation.set(layers[a].translation.x +
                    boxWidth / 2, layers[a].translation.y)
                networkGroup.add(plussign)
            }
            if (!added && a != compoundwork["layers"].length - 1) {
                addMinusSign()
            }
            if (added) {
                var valid = function () {
                    for (var i = a; i < compoundwork["layers"].length; i++) {
                        if (compoundwork["layers"][i]["type"] === "conv" ||
                            compoundwork["layers"][i]["type"] === "flatten") {
                            return false
                        }
                    }
                    return true
                }

                var tipo = compoundwork["layers"][a - 1]["type"]
                if (added === 1 && tipo != "conv") {
                    addPlusSign()
                } else if (added === 2 && (tipo === "conv" || tipo ===
                        "pool")) {
                    addPlusSign()
                } else if (added === 3 && (tipo === "conv" || tipo ===
                        "pool") && valid()) {
                    addPlusSign()
                } else if (added === 4 && (tipo === "conv" || tipo === "nn")) {
                    addPlusSign()
                }
            } else {
                var nodes = new Two.Group()
                var pastchildren = layers[a - 1].children
                var pastx = layers[a - 1].translation.x,
                    pasty = layers[a - 1].translation.y
                var x = layers[a].translation.x,
                    y = layers[a].translation.y
                var children = layers[a].children
                for (var i = 0; i < pastchildren.length; i++) {
                    for (var j = 0; j < children.length; j++) {
                        if (pastchildren[i]._renderer.type != 'group' &&
                            children[j]._renderer.type != 'group') {
                            var x1 = pastx + pastchildren[i].translation.x,
                                y1 = pasty + pastchildren[i].translation.y
                            var x2 = x + children[j].translation.x,
                                y2 = y + children[j].translation.y
                            var ln = two.makeLine(x1, y1, x2, y2)
                            ln.stroke = strokeColor
                            ln.linewidth = 3
                            nodes.add(ln)
                        }
                    }
                }
                connections.push(nodes)
                networkGroup.add(nodes)
            }
            addDeliciousListener(layers[a - 1], "click", sideBAR(a - 1))
            networkGroup.add(layers[a - 1])
        }
    }
    addDeliciousListener(layers[layers.length - 1], "click", sideBAR(layers
        .length - 1))
    networkGroup.add(layers[layers.length - 1])
    networkGroup.scale = Math.min(0.9 * two.width / networkGroup.getBoundingClientRect()
        .right, 1)
    networkGroup.translation.set(0, two.height / 2 - boxHeight *
        networkGroup.scale / 2)

    two.add(networkGroup)
    updateAll()
}

var network = {
    "layers": [
        {
            "type": "conv",
            "size": 20,
            "filter_size": 3,
            "activation": "relu"
        },
        {
            "type": "flatten"
        },
        {
            "type": "nn",
            "size": 10,
            "activation": "softmax"
        }
    ],
    "info": {
        "epochs": 100,
        "batch_size": 64,
        "output_size": 10,
        "dataset": "mnist"
    }
}

load_model()

function load_model(){
    var input_size = datasetInfo[network["info"]["dataset"]]["input_size"]
    var output_size = datasetInfo[network["info"]["dataset"]]["output_size"]
    var info = network["info"]
//    var x = tf.input({shape: input_size})
//    new_x = x
    model = tf.sequential()
    model.add(tf.layers.inputLayer({
        inputShape: input_size
    }))
    for(var layer of network["layers"]){
        if(layer["type"]=="nn"){
            model.add(tf.layers.dense({
                 units: layer["size"],
                 activation: layer["activation"],
                 useBias: true
            }))
            console.log("nn")
        }
        else if(layer["type"]=="conv"){
            model.add(tf.layers.conv2d({
                 kernelSize: layer["filter_size"],
                 filters: layer["size"],
                 activation: layer["activation"],
                 useBias: true,
                 pad: "same"
            }))
            console.log("conv")
        }
        else if(layer["type"]=="flatten"){
            model.add(tf.layers.flatten())
            console.log("flatten")
        }
        else if(layer["type"]=="pool"){
            model.add(tf.layers.maxPooling2d({
                 poolSize: layer["pool_size"]
            }))
            console.log("pool")
        }
    }
    model.add(tf.layers.dense({
         units: output_size,
         activation: "softmax",
         useBias: true,
         name: "output"
    }))
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    })
}

$('#start-train').click(function () {
    $("#loading-text").html("Loading Model and Data...");
    $("#loading").show()

    load_model()

    jQuery.loadScript = function (url, callback) {
        jQuery.ajax({
            url: url,
            dataType: 'script',
            success: callback,
            async: true
        });
    }
    loaded = false
    $.loadScript("data/"+network["info"]["dataset"]+"/x.js", function(){
        console.log("data_x loaded")
        if(!loaded){
            loaded = true
        }else{
            train()
        }
    });
    $.loadScript("data/"+network["info"]["dataset"]+"/y.js", function(){
        console.log("data_y loaded")
        if(!loaded){
            loaded = true
        }else{
            train()
        }
    });
})

async function train(){
    var output_size = datasetInfo[network["info"]["dataset"]]["output_size"]
    data_y = tf.oneHot(data_y, output_size)
//    for(let i=0; i<network["info"]["epochs"]; ++i){
//        train_new_batch(i)
//    }
    var batch_size = network["info"]["batch_size"]
    var epochs = network["info"]["epochs"]
    const h = await model.fit(data_x, data_y, {
        epochs: epochs,
        batchSize: batch_size,
        validationSplit: 0.1,
        callbacks: {
            onTrainBegin: async (epoch, logs) => {
                $("#loading-text").html("Training...")
                await tf.nextFrame();
            },
            onTrainEnd: async (epoch, logs) => {
                $("#loading").hide()
                await tf.nextFrame();
            },
            onEpochEnd: async (epoch, logs) => {
                $("#loading-text").html("Training Loss:<br>" + logs.loss +
                                        "<br>Training Accuracy:<br>" + logs.acc +
                                        "<br>Validation Loss:<br>" + logs.val_loss +
                                        "<br>Validation Accuracy:<br>" + logs.val_acc)
                await tf.nextFrame();
            }
        }
    })
}

//async function train_new_batch(i){
//    var batch_size = network["info"]["batch_size"]
//    batch_num = data_y.shape[0]/batch_size - 1
//    if(i > batch_num){
//        i %= batch_num
//    }
//    h = await model.fit(data_x.slice(i * batch_size, batch_size), data_y.slice(i * batch_size, batch_size), {
//       epochs: 1,
//       batchSize: batch_size
//    });
//    loss(h.history.loss[0])
//}

//if (window.location.hash) {
//    $("#loading").show();
//    network["id"] = window.location.hash;
//    socket.emit('from id', window.location.hash);
//
//    socket.on('model from id', function (data) {
//        network = data;
//        console.log(data)
//        renderNetwork(0);
//        $("#loading").hide();
//    });
//}

renderNetwork(0)

var current = 0;

$('#add-nn').click(function() {
    if (current !== 1) {
        renderNetwork(1)
        current = 1;
    } else {
        renderNetwork(0);
        current = 0;
    }
});
$('#add-conv').click(function() {
    if (current !== 2) {
        renderNetwork(2)
        current = 2;
    } else {
        renderNetwork(0);
        current = 0;
    }
});
$('#add-flatten').click(function() {
    if (current !== 3) {
        renderNetwork(3)
        current = 3;
    } else {
        renderNetwork(0);
        current = 0;
    }
});
$('#add-pool').click(function() {
    if (current !== 4) {
        renderNetwork(4)
        current = 4;
    } else {
        renderNetwork(0);
        current = 0;
    }
});


async function testFile() {

    var file = document.getElementById("test-file-ipt").files[0];
    if (file) {
        var url = URL.createObjectURL(file)
        $("#img-disp").attr("src", url);
        $("#img-run").show();
        var input_size = datasetInfo[network["info"]["dataset"]]["input_size"]
        input_size = [input_size[0], input_size[1]]
        var img = new Image(input_size[0], input_size[1]);
        img.src = url
        var image = tf.fromPixels(img)
        image = tf.div(tf.image.resizeBilinear(image, input_size).toFloat(), tf.scalar(256.0)).expandDims()
        var dataset = network["info"]["dataset"]
        if(dataset === "mnist"){
            image = image.mean(-1, true)
        }
        const pred = await model.predict(image).data()
        var pred_output = "Predictions:<br>"
        var class_num = 0
        for(var prob of pred){
            pred_output += dataset === "mnist" ? class_num : cifarDict[class_num]
            pred_output += ": " + (prob*100) + "%<br>"
            class_num ++
        }
        $("#img-prediction").html(pred_output)
    }

}

//socket.on('run result', function(data) {
//    $("#img-prediction").html(data);
//});




function generateGrid() {

    var two = new Two({
      type: Two.Types.canvas,
      width: 16,
      height: 16,
      ratio: 2
    });

    var width = two.width / 2;
    var height = two.height / 2;

    var background = two.makeRectangle(two.width / 2, two.height / 2, two.width, two.height);
    background.noStroke().fill = '#f7f7f7';

    var c = two.makeCircle(two.width / 2, two.height / 2, 0.5);
    c.noStroke().fill = '#888';

    two.update();

    return two.renderer.domElement.toDataURL('image/png');

  }
