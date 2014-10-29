if (typeof SJtsk2Wgs84 == 'undefined') { SJtsk2Wgs84 = {}; }

SJtsk2Wgs84.transformer = {

    constants: {
            M_PI  : 3.14159265358979323846, // pi
            M_PI_2: 1.57079632679489661923, // pi/2
            H     : 200,
            e     : 0.081696831215303,
            n     : 0.97992470462083,
            u_ro: 12310230.12797036,
            sinUQ : 0.863499969506341,
            cosUQ : 0.504348889819882,
            sinVQ : 0.420215144586493, 
            cosVQ : 0.907424504992097,
            alfa  : 1.000597498371542,
            k     : 1.003419163966575,
            a_sjtsk:6377397.15508, 
            a_wgs : 6378137.0, 
            f_1_sjtsk:299.152812853,
            f_1_wgs  :298.257223563,
            dx    : 570.69,
            dy    : 85.69,
            dz    : 462.84,
            m     : 0.000003543
    },

    // algorithm copied from http://diskuse.jakpsatweb.cz/?action=vthread&forum=3&topic=145425
    transform: function transform(x,y) {
        /*Vypocet zemepisnych souradnic z rovinnych souradnic*/
        var C = this.constants,
            ro=Math.sqrt(x*x+y*y),
            epsilon=2*Math.atan(y/(ro+x)),
            D=epsilon/C.n,
            S=2*Math.atan(Math.exp(1/C.n*Math.log(C.u_ro/ro)))-C.M_PI_2,
            sinS=Math.sin(S),
            cosS=Math.cos(S),
            sinU=C.sinUQ*sinS-C.cosUQ*cosS*Math.cos(D),
            cosU=Math.sqrt(1-sinU*sinU),
            sinDV=Math.sin(D)*cosS/cosU, 
            cosDV=Math.sqrt(1-sinDV*sinDV),
            sinV=C.sinVQ*cosDV-C.cosVQ*sinDV,
            cosV=C.cosVQ*cosDV+C.sinVQ*sinDV,
            Ljtsk=2*Math.atan(sinV/(1+cosV))/C.alfa,
            t=Math.exp(2/C.alfa*Math.log((1+sinU)/cosU/C.k)),
            pom=(t-1)/(t+1),
            sinB, 
            xn, yn, zn,
            wz, wy, wx,
            a_b, p, e2, theta, st, ct, L, H;
        if (y>x) {
            throw "Coordinates not compliant to S-JTSK (Y>X).";
        }
        do {
            sinB=pom;
            pom=t*Math.exp(C.e*Math.log((1+C.e*sinB)/(1-C.e*sinB))); 
            pom=(pom-1)/(pom+1);
        } while (Math.abs(pom-sinB)>0.000000000000001);
        Bjtsk=Math.atan(pom/Math.sqrt(1-pom*pom));


        /* Pravoúhlé souřadnice ve S-JTSK */   
        e2=1-(1-1/C.f_1_sjtsk)*(1-1/C.f_1_sjtsk); 
        ro=C.a_sjtsk/Math.sqrt(1-e2*Math.sin(Bjtsk)*Math.sin(Bjtsk));
        x=(ro+C.H)*Math.cos(Bjtsk)*Math.cos(Ljtsk);  
        y=(ro+C.H)*Math.cos(Bjtsk)*Math.sin(Ljtsk);  
        z=((1-e2)*ro+C.H)*Math.sin(Bjtsk);
        
        /* Pravoúhlé souřadnice v WGS-84*/
        wz=-5.2611/3600*C.M_PI/180;
        wy=-1.58676/3600*C.M_PI/180;
        wx=-4.99821/3600*C.M_PI/180; 
        xn=C.dx+(1+C.m)*(x+wz*y-wy*z); 
        yn=C.dy+(1+C.m)*(-wz*x+y+wx*z); 
        zn=C.dz+(1+C.m)*(wy*x-wx*y+z);
 
        /* Geodetické souřadnice v systému WGS-84*/
        a_b=C.f_1_wgs/(C.f_1_wgs-1); 
        p=Math.sqrt(xn*xn+yn*yn); 
        e2=1-(1-1/C.f_1_wgs)*(1-1/C.f_1_wgs);
        theta=Math.atan(zn*a_b/p); 
        st=Math.sin(theta); 
        ct=Math.cos(theta);
        t=(zn+e2*a_b*C.a_wgs*st*st*st)/(p-e2*C.a_wgs*ct*ct*ct);
        B=Math.atan(t);  
        L=2*Math.atan(yn/(p+xn));  
        H=Math.sqrt(1+t*t)*(p-C.a_wgs/Math.sqrt(1+(1-e2)*t*t));
 
        B_deg = B/C.M_PI*180;
        L_deg = L/C.M_PI*180;
        return { lat: B_deg, lng: L_deg };
    }

}
