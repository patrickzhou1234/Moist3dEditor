const canvas = document.getElementById("babcanv"); // Get the canvas element
menuselections = document.getElementById("menuselections");
frontfacingvis = document.getElementById("frontfacingvis");
checked = true;
meshtype = document.getElementById("meshtype");
menureveal = document.getElementById("menureveal");
size = document.getElementById("sizeToggle");
const engine = new BABYLON.Engine(canvas, true);
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin);
    
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 10, 30, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.setPosition(new BABYLON.Vector3(0, 20, -30));
    // camera.attachControl(canvas, true);

    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);
    camera.keysUp.pop(38);
    camera.keysDown.pop(40);
    camera.keysLeft.pop(37);
    camera.keysRight.pop(39);
    camera.angularSensibility = 10000;

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var wallmat = new BABYLON.StandardMaterial("wallmat", scene);
    wallmat.diffuseTexture = new BABYLON.Texture("wood.jpg", scene);
    wallmat.backFaceCulling = false;

    var groundmat = new BABYLON.StandardMaterial("groundmat", scene);
    groundmat.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/fr2946D.png", scene);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
    ground.material = groundmat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:0.3}, scene);
    var wallz = [15, 0, 0, -15];
    var wallrot = [0, 1, 1, 0];
    var wallx = [null, -15, 15, null];
    for (i=0;i<4;i++) {
        var wall = BABYLON.MeshBuilder.CreateBox("wall", {width:30, height:2, depth:0.5}, scene);
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution: 0.9}, scene);
        wall.position.y = 1;
        wall.position.z = wallz[i];
        wall.material = wallmat;
        if (wallrot[i] == 1) {
            wall.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2, BABYLON.Space.LOCAL);
        }
        if  (!(wallx[i] == null)) {
            wall.position.x = wallx[i];
        }
    }

    var bluemat = new BABYLON.StandardMaterial("bluemat", scene);
    bluemat.diffuseColor = new BABYLON.Color3.FromHexString("#87CEEB");
    bluemat.backFaceCulling = false;
    var skybox = BABYLON.MeshBuilder.CreateSphere("skybox", {segments:32, diameter:100}, scene);
    skybox.material = bluemat;

    player = BABYLON.MeshBuilder.CreateSphere("player", {diameter:2, segments:32}, scene);
    player.position.y = 3;
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0.3}, scene);

    frontfacing = BABYLON.Mesh.CreateBox("front", 1, scene);
    frontfacing.position.z += 5;
    frontfacing.parent = camera;
    frontfacing.visibility = 0.5;

    backfacing = BABYLON.Mesh.CreateBox("back", 1, scene);
    backfacing.position.z -= 5;
    backfacing.parent = camera;
    backfacing.visibility = 0;

    leftfacing = BABYLON.Mesh.CreateBox("left", 1, scene);
    leftfacing.position.x -= 5;
    leftfacing.parent = camera;
    leftfacing.visibility = 0;

    rightfacing = BABYLON.Mesh.CreateBox("right", 1, scene);
    rightfacing.position.x += 5;
    rightfacing.parent = camera;
    rightfacing.visibility = 0;

    scene.registerBeforeRender(function() {
        camera.position.set(player.position.x, player.position.y, player.position.z);
    });
    return scene;
};

frontfacingvis.onchange = function() {
  if (checked) {
    frontfacing.visibility = 0;
    checked = false;
  } else {
    frontfacing.visibility = 0.5;
    checked = true;
  }
}

canvas.onclick = function() {
      canvas.requestPointerLock = 
      canvas.requestPointerLock ||
      canvas.mozRequestPointerLock ||
      canvas.webkitRequestPointerLock
      canvas.requestPointerLock();

      sizeval = size.value/50;

      meshmat = new BABYLON.StandardMaterial("meshmat", scene);
    meshmat.diffuseColor = new BABYLON.Color3.FromHexString(document.getElementById("colorpicker").value);
    meshmat.backFaceCulling = false;

      if (meshtype.value == "box") {
        var mesh = BABYLON.MeshBuilder.CreateBox("mesh", {size:sizeval}, scene);
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:1, restitution:0}, scene);
      }
      else if (meshtype.value == "sphere") {
        var mesh = BABYLON.MeshBuilder.CreateSphere("mesh", {diameter:sizeval, segments:32}, scene);
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0}, scene);
      }
      else if (meshtype.value == "cylinder") {
        var mesh = BABYLON.MeshBuilder.CreateCylinder("mesh", {height:sizeval, diameter:sizeval}, scene);
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, {mass:1, restitution:0}, scene);
      }
      else if (meshtype.value == "capsule") {
        var mesh = BABYLON.MeshBuilder.CreateCapsule("mesh", {height:sizeval, radius:(sizeval/3)}, scene);

    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CapsuleImpostor, {mass:1, restitution:0}, scene);
      }
      mesh.material = meshmat;
      if (meshtype.value == "box" || meshtype.value == "cylinder") {
        mesh.enableEdgesRendering();
        mesh.edgesWidth = 4.0;
        mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
      }
      mesh.position = frontfacing.getAbsolutePosition();
}

jumpreloading = false;
canvas.onkeydown = function(event) {
    if (event.keyCode == "32") {
        if (!(jumpreloading)) {
            jumpreloading = true;
            player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 1, 0).scale(10), player.getAbsolutePosition());
            setTimeout(function() {
                jumpreloading = false;
            }, 3000);
        }
    }
    if (event.keyCode == "87") {
        player.physicsImpostor.applyImpulse(frontfacing.getAbsolutePosition().subtract(player.getAbsolutePosition()).scale(0.05), player.getAbsolutePosition());
    }
    if (event.keyCode == "83") {
        player.physicsImpostor.applyImpulse(backfacing.getAbsolutePosition().subtract(player.getAbsolutePosition()).scale(0.05), player.getAbsolutePosition());
    }
    if (event.keyCode == "65") {
        player.physicsImpostor.applyImpulse(leftfacing.getAbsolutePosition().subtract(player.getAbsolutePosition()).scale(0.05), player.getAbsolutePosition());
    }
    if (event.keyCode == "68") {
        player.physicsImpostor.applyImpulse(rightfacing.getAbsolutePosition().subtract(player.getAbsolutePosition()).scale(0.05), player.getAbsolutePosition());
    }
}

menureveal.onclick = function() {
  if (menureveal.innerHTML == "⇧") {
    menureveal.innerHTML = "⇩";
    menureveal.style.top = "0px";
    menuselections.style.top = "-6vh";
  } else {
    menureveal.innerHTML = "⇧";
    menureveal.style.top = "6vh";
    menuselections.style.top = "0vh";
  }
}

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
