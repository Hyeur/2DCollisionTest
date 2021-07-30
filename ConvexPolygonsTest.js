$(function() {
    var canvas = document.getElementById('Canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');



        var a1 = new xy(74, 62);
        var a2 = new xy(69, 184);
        var a3 = new xy(196, 176);
        var a4 = new xy(229, 75);

        var b1 = new xy(641, 654);
        var b2 = new xy(578, 632);
        var b3 = new xy(659, 536);
        var b4 = new xy(734, 639);


        var A = [a1, a2, a3, a4];
        var B = [b1, b2, b3, b4];

        var speed = 0.5;
        var adx = speed;
        var ady = speed;
        var bdx = -speed;
        var bdy = -speed;


        var lastFrameTimeMs = 0;
        var maxFPS = 10;
        var delta = 0;

        function draw(timestamp) {

            delta = timestamp - lastFrameTimeMs; // get the delta time since last frame
            lastFrameTimeMs = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the before canvas
            for (let index = 0; index < A.length; index++) {
                A[index].x += adx * delta;
                A[index].y += ady * delta;
            }
            for (let index = 0; index < B.length; index++) {
                B[index].x += 0.5 * bdx * delta;
                B[index].y += bdy * delta;
            }




            var verticesA = [A[0], A[1], A[2], A[3]];
            var edgesA = [Vecto(A[0], A[1]), Vecto(A[1], A[2]), Vecto(A[2], A[3]), Vecto(A[3], A[0])];

            var verticesB = [B[0], B[1], B[2], B[3]];
            var edgesB = [Vecto(B[0], B[1]), Vecto(B[1], B[2]), Vecto(B[2], B[3]), Vecto(B[3], B[0])];


            var polygonA = new polygon(verticesA, edgesA);
            var polygonB = new polygon(verticesB, edgesB);



            if (sat(polygonA, polygonB)) {
                document.body.style.backgroundColor = "red";
                ady = -ady;
                adx = -adx;
                bdx = -bdx;
                bdy = -bdy;
            } else {
                document.body.style.backgroundColor = "rgb(247, 231, 238)";
            }
            // sat(polygonA, polygonB);

            drawPoly1();
            drawPoly2();
            checkCol();

            requestAnimationFrame(draw);
        }



    }
    requestAnimationFrame(draw);

    function checkCol() {
        for (let i = 0; i < A.length; i++) {
            if (A[i].x < 0 || A[i].x > canvas.width) {
                adx = -adx;
            } else if (A[i].y < 0 || A[i].y > canvas.height) {
                ady = -ady;
            }

        }
        for (let i = 0; i < B.length; i++) {
            if (B[i].x < 0 || B[i].x > canvas.width) {
                bdx = -bdx;
            }
            if (B[i].y < 0 || B[i].y > canvas.height) {
                bdy = -bdy;
            }
        }

    }


    function drawPoly1() {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.lineTo(a3.x, a3.y);
        ctx.lineTo(a4.x, a4.y);
        ctx.closePath();
        ctx.fill();
    }

    function drawPoly2() {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.lineTo(b4.x, b4.y);
        ctx.closePath();
        ctx.fill();
    }

    function Vecto(C, D) {
        return new xy((D.x - C.x), (D.y - C.y));
    }

    function xy(x, y) {
        this.x = x;
        this.y = y;
    };

    function polygon(vertices, edges) {
        this.vertex = vertices;
        this.edge = edges;
    };
    //include appropriate test case code.
    var amin = null;
    var amax = null;
    var bmin = null;
    var bmax = null;
    var invade = null;

    function sat(polygonA, polygonB) {
        var perpendicularLine = null;
        var dot = 0;
        var perpendicularStack = [];
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        for (var i = 0; i < polygonA.edge.length; i++) {
            perpendicularLine = new xy(-polygonA.edge[i].y, polygonA.edge[i].x);
            perpendicularStack.push(perpendicularLine);
        }
        for (var i = 0; i < polygonB.edge.length; i++) {
            perpendicularLine = new xy(-polygonB.edge[i].y, polygonB.edge[i].x);
            perpendicularStack.push(perpendicularLine);
        }
        for (var i = 0; i < perpendicularStack.length; i++) {
            amin = null;
            amax = null;
            bmin = null;
            bmax = null;
            for (var j = 0; j < polygonA.vertex.length; j++) {
                dot = (polygonA.vertex[j].x *
                        perpendicularStack[i].x) +
                    (polygonA.vertex[j].y *
                        perpendicularStack[i].y);
                if (amax === null || dot > amax) {
                    amax = dot;
                }
                if (amin === null || dot < amin) {
                    amin = dot;
                }
            }
            for (var j = 0; j < polygonB.vertex.length; j++) {
                dot = polygonB.vertex[j].x *
                    perpendicularStack[i].x +
                    polygonB.vertex[j].y *
                    perpendicularStack[i].y;
                if (bmax === null || dot > bmax) {
                    bmax = dot;
                }
                if (bmin === null || dot < bmin) {
                    bmin = dot;
                }
            }


            if ((amin < bmax && amin > bmin) ||
                (bmin < amax && bmin > amin)) {
                if (amax >= bmax) {
                    invade = Math.abs(amax - bmin) - Math.abs(amax - bmax) - Math.abs(amin - bmin);
                } else { invade = Math.abs(bmax - amin) - Math.abs(bmax - amax) - Math.abs(bmin - amin); }
                continue;
            } else {
                return false;
            }

        }


        return true;
    }
});