import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from '../core/core.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.less']
})
export class JobPostComponent implements OnInit {
  public postFormGroup: FormGroup;

  constructor(
    private core: CoreService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initPostForm();
  }
  initPostForm() {
    this.postFormGroup = this.fb.group({
      postName: [""],
      descr: [""],
      jobLocation: [""],
      priceRange: [""],
      jobType: [""],
      start: [""],
      deadline: [""],
      experience: [""],
      userSkill: [""],
      other: [""],
      companyName: [""],
    });


  }

  createJobPost() {
    let data = this.postFormGroup.value;

    data.jobType = data.jobType + " " + data.other;
    delete data['other']

    this.authService.createJobPost(data).then((post: any) => {
      console.log(post)
      this.core.success("Post Created Successfully");
      this.postFormGroup.reset()
    }).catch(err => {
      console.log(err)
    })
  }

}
