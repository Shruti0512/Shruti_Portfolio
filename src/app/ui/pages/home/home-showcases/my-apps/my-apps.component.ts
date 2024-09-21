import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { ReplaySubject, takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable } from 'rxjs';
import { AppType } from 'src/app/types/apps_type';
import { TRANSITION_IMAGE_SCALE, TRANSITION_TEXT } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_IMAGE_SCALE
  ]
})
export class MyAppsComponent implements OnInit {


  _mApps : AppType[] = [

    {
     "id": "5131",
     "name": "Online Voting Application",
     "tab": "Android",
     "caption": "The application was built for the Android platform, ensuring a mobile-first approach, which is essential for users to access the system conveniently. he app leverages Android’s biometric authentication features (such as fingerprint or facial recognition) to ensure that users are uniquely identified. This feature guarantees that only authorized users (voters) can cast their votes. This project demonstrates my ability to develop secure, scalable applications with a focus on ensuring data integrity, real-time updates, and ease of use for both voters and administrators.",
     "isFull": false,
     "primary":"#3FD67D",
     "background":"#E1E1E1"
   },
   {
     "id": "5132",
     "name": "Driver drowsiness detection system",
     "tab": "Android",
     "isFull": false,
     "caption": "This System aims to prevent accidents caused by fatigued or sleepy drivers. Using computer vision technologies like OpenCV (for image processing) and MATLAB (for algorithm development and data analysis), the system monitors the driver's face, specifically focusing on key indicators of drowsiness. OpenCV and MATLAB allow the system to be developed and tested across various platforms. MATLAB can be used for initial development, simulations, and algorithm testing, while OpenCV ensures that the system can be efficiently deployed in real-time environments.",
     "background":"#F5E7B4"
   },
   {
     "id": "5133",
     "name": "Personal Talking Virtual Assistant Project",
     "tab": "Android",
     "caption": "This project is an intelligent assistant that can autonomously handle user queries, execute specific tasks like playing music on YouTube, sending emails, and provide a range of conversational interactions. It incorporates several advanced concepts in machine learning, natural language processing, and automation. The email feature ensures data security by using encrypted connections (typically via SSL or TLS) to send emails. This ensures that sensitive data, such as login credentials and email content, are transmitted securely over the network.",
     "isFull": false,
     "background":"#3CE79F"
   },
   {
    "id": "5133",
    "name": "Group Chat Desktop Application Project",
    "tab": "Android",
    "caption": "The Group Chat Desktop Application is a fully functional, real-time communication platform designed to allow multiple users to chat simultaneously. The project demonstrates key concepts in network programming and multi-threading using Java, with an intuitive GUI built with Java Swing. It allows for seamless message transmission between multiple clients, with the server managing all communication and broadcasting messages to ensure data consistency and accuracy. The application is built using Java with Socket Programming for handling network communication, and Java Swing for creating the graphical user interface (GUI). ",
    "isFull": false,
    "background":"#3CE80F"
   }
  ];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false

  /* ********************************************************************************************
    *                anims
    */
  _mTriggerAnim?= 'false'



  _mThreshold = 0.4


  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler,
    private formBuilder: FormBuilder) {



  }

  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {

    this.destroyed$.next(true)
    this.destroyed$.complete()
  }




  /* ***************************************************************************
   *                                  other parts
   */


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => {
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }
}
