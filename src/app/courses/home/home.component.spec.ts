import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";

import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { setupCourses } from "../common/setup-test-data";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    const coursesSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  it("should display advanced courses when tab clicked", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    console.log(tabs[1]);
    tabs[1].triggerEventHandler("click", new MouseEvent("click"));
    fixture.detectChanges();
    console.log(tabs[1]);
    expect(tabs[1].nativeElement.classList).toContain("mdc-tab--active");
  });
});
